import { Lightning, Router } from '@lightningjs/sdk'
import { BRANDING_COLORS } from '../../../utils/constants/Colors'
import Button from '../../../components/button/Button'
import { Direction } from '../../../utils/constants/ConstantsForStyle'
import MediaHeader from '../components/MediaHeader'
import MediaInformations from '../components/MediaInformations'
import { IMAGES_URL } from '../../../utils/constants/URLs'
import { CONTENT_RATING } from '../../../utils/constants/Constants'
import { URLS_VITE } from '../../../utils/constants/env'

export default class SeriesDetalPage extends Lightning.Component {

    static _template() {
        return {
            w: 1920,
            h: 1080,
            Background: {
                w: 1920,
                h: 1080,
            },
            Layout: {
                rect: true,
                x: 0,
                y: 0,
                w: 1920,
                h: 1080,
                color: BRANDING_COLORS.BLACK_TRANSPARENT,
            },
            BackButton: {
                x: 69,
                y: 65,
                w: 112,
                h: 64,
                type: Button
            },
            Detail:
            {
                flex: { direction: Direction.Column, },
                x: 69,
                y: 173,
                w: 1083,
                h: 592,

                MediaHeader: {
                    h: 90,
                    type: MediaHeader
                },
                BodyInformations: {
                    y: 15,
                    type: MediaInformations
                }

            }
        }
    }
    get _BackButton() {
        return this.tag('BackButton')
    }
    get _BodyInformations() {
        return this.tag('BodyInformations')
    }
    get _MediaHeader() {
        return this.tag('MediaHeader')
    }
    get _Background() {
        return this.tag('Background')
    }
    set props(props) {
        this._props = { ...this._props, ...props };

        const { details, actors, directors } = this._props;
        if (!details) {
            console.warn("No movie details found in props");
            return;
        }
        const { genres = [], backdrop_path, first_air_date, last_air_date, origin_country, adult, vote_average, created_by, poster_path, name, overview } = details;

        const yearStart = first_air_date?.toString().split("-")[0] ?? "";
        const yearEnd = last_air_date?.toString().split("-")[0] ?? "";

        const formattedRating = Number.isInteger(vote_average) ? vote_average : vote_average.toFixed(1);
        const info = `${origin_country} - ${(adult ? CONTENT_RATING.PG : CONTENT_RATING.G)} - IMDb: ${formattedRating}`;
        const imageUrl = backdrop_path ? `${URLS_VITE.VITE_TMDB_IMAGE_URL_POSTER}${backdrop_path}` : Utils.asset(IMAGES_URL.SHINDIRI);
        this.patch({
            Detail: {
                MediaHeader: {
                    props: {
                        genres: genres,
                        dateTime: yearStart + " - " + yearEnd,
                        shortInformations: info
                    }
                },
                BodyInformations: {
                    props: {
                        poster_path: poster_path,
                        title: name,
                        overview: overview,
                        created_by: created_by,
                        actors: actors,
                        directorCreator: directors
                    }
                }
            },
            Background: { src: imageUrl },
            BackButton: { props: { src: IMAGES_URL.BACK_ICON, size: 48 } }
        });
    }

    get _WatchButton() {
        return this._BodyInformations._WatchButton;
    }

    _active() {
        this._setState('WatchFocused');
    }

    static _states() {
        return [
            class BackFocused extends this {
                _getFocused() {
                    return this._BackButton;
                }

                _handleRight() {
                    this._setState('WatchFocused');
                }

                _handleEnter() {
                    const router = Router.getHistory().filter(
                        (history) => history.hash != 'splash' && history.hash != 'cmp'
                    );

                    if (router.length) {
                        Router.setHistory([...router]);
                        Router.back();
                    } else {

                        Router.navigate('home');
                    }
                }
            },

            class WatchFocused extends this {
                _getFocused() {
                    return this._WatchButton;
                }

                _handleLeft() {
                    this._setState('BackFocused');
                    return true;
                }
            }
        ]
    }
}