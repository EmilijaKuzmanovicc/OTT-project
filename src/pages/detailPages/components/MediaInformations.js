import Lightning from "@lightningjs/sdk/src/Lightning";
import { Direction, Fonts } from "../../../utils/constants/ConstantsForStyle";
import { IMAGES_URL } from "../../../utils/constants/URLs";
import { BRANDING_COLORS } from "../../../utils/constants/Colors";
import PropertyRow from "./PropertyRow";
import { joinWords } from "../utils/joinWords";
import Button from "../../../components/button/Button";


export default class MediaInformations extends Lightning.Component {
    static _template() {
        return {
            flex: { direction: Direction.Row },
            Image: {
                w: 325,
                h: 485,
            },
            Details: {
                x: 60,
                w: 698,
                h: 435,
                flex: {
                    direction: Direction.Column,

                },
                Title: {
                    text: {
                        fontFace: Fonts.SemiBold,
                        fontSize: 28,
                        textColor: BRANDING_COLORS.WHITE,
                    }

                },
                Overview: {
                    y: 20,
                    w: 698,
                    text: {
                        fontFace: Fonts.SemiBold,
                        fontSize: 22,
                        textColor: BRANDING_COLORS.WHITE,
                        wordWrap: true,
                        maxLines: 4,
                        letterSpacing: 1,
                        lineHeight: 31,
                        maxLinesSuffix: "...",
                    }

                },
                DirectorCreator: {
                    y: 40,
                    w: 698,
                    type: PropertyRow,
                },
                Creator: {
                    h: 62,
                    w: 698,
                    y: 40,
                    type: PropertyRow,
                },
                Casts: {
                    h: 62,
                    w: 698,
                    y: 40,
                    type: PropertyRow,
                },
                WatchButton: {
                    y: 60,
                    w: 286,
                    h: 78,
                    type: Button

                }

            }
        }
    }

    get _Image() {
        return this.tag('Image')
    }
    get _Details() {
        return this.tag('Details')
    }
    get _Title() {
        return this.tag('Details.Title')
    }
    get _Overview() {
        return this.tag('Details.Overview')
    }
    get _WatchButton() {
        return this.tag('Details.WatchButton')
    }
    set props(props) {
        this._props = { ...this._props, ...props };
        const { poster_path, title, overview, actors, directorCreator, created_by } = this._props;

        const imageUrl = poster_path
            ? `${import.meta.env.VITE_TMDB_IMAGE_URL_HTTP}${poster_path}`
            : Utils.asset(IMAGES_URL.IMAGE_NOT_FOUND);

        const hasCreator = !!created_by;
        this.patch({
            Image: { src: imageUrl },
            Details: {
                Title: { text: title },
                Overview: { text: overview },
                DirectorCreator: {
                    props: {
                        label: "Director", elements: directorCreator.length === 0 ? 'No director' : joinWords(directorCreator)
                    }
                },
                Creator: {
                    visible: Array.isArray(created_by),
                    props: {
                        label: "Created by",
                        elements: Array.isArray(created_by) && created_by.length > 0
                            ? joinWords(created_by)
                            : 'No  creator'
                    }
                },
                Casts: {
                    props: {
                        label: "Casts", elements: actors.length === 0 ? 'No actors' : joinWords(actors)
                    }
                },

                WatchButton: {
                    props: {
                        src: IMAGES_URL.PLAY,
                        size: 18,
                        text: "WATCH NOW"
                    }
                }

            },

        })

    }
}