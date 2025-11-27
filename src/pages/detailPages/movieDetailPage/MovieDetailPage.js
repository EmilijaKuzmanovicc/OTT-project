import { Lightning, Router, Utils } from '@lightningjs/sdk'
import Button from '../../../components/button/Button';
import { IMAGES_URL } from '../../../utils/constants/URLs';
import { Direction } from '../../../utils/constants/ConstantsForStyle';
import MediaHeader from '../components/MediaHeader';
import { CONTENT_RATING } from '../../../utils/constants/Constants';
import MediaInformations from '../components/MediaInformations';
import { BRANDING_COLORS } from '../../../utils/constants/Colors';
import { URLS_VITE } from '../../../utils/constants/env';

export default class MovieDetalPage extends Lightning.Component {

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

        const { genres = [], backdrop_path, release_date, origin_country, adult, vote_average, runtime, poster_path, title, overview } = details;
        const year = release_date.split("-")[0];
        const formattedRating = Number.isInteger(vote_average) ? vote_average : vote_average.toFixed(1);
        const info = `${origin_country} - ${year} - ${(adult ? CONTENT_RATING.PG : CONTENT_RATING.G)} - IMDb: ${formattedRating}`;
        const imageUrl = backdrop_path ? `${URLS_VITE.VITE_TMDB_IMAGE_URL_POSTER}${backdrop_path}` : Utils.asset(IMAGES_URL.SHINDIRI);

        this.patch({
            Detail: {
                MediaHeader: {
                    props: {
                        genres: genres,
                        dateTime: runtime + " Minutes",
                        shortInformations: info
                    }
                },
                BodyInformations: {
                    props: {
                        poster_path: poster_path,
                        title: title,
                        overview: overview,
                        actors: actors,
                        directorCreator: directors
                    }
                }
            },
            Background: { src: imageUrl },
            BackButton: { props: { src: IMAGES_URL.BACK_ICON, size: 48, onEnter: this._handleBack.bind(this) } }
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

                _handleDown() {
                    this._setState('WatchFocused');
                }

                _handleEnter() {
                    this._handleBack()
                }
            },

            class WatchFocused extends this {
                _getFocused() {
                    return this._WatchButton;
                }

                _handleUp() {
                    this._setState('BackFocused');
                    return true;
                }

                _handleEnter() {
                    Router.navigate('player', { videoURL: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', title: this._props.details.title });
                    return true;
                }
            }
        ]
    }
    _handleBack() {
        if (Router.isNavigating()) {
            return;
        }

        const routerHistory = Router.getHistory().filter(
            history => history.hash !== 'splash' && history.hash !== 'cmp'
        );

        if (routerHistory.length) {
            Router.back();
        } else {
            Router.navigate('home');
        }
    }
}

