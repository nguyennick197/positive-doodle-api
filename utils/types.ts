export interface Doodle {
    id?: number;
    url?: string;
    image_text?: string;
    tags?: string;
    tumblr_image_url?: string;
    background_color?: number[];
    created_at?: string;
    similar?: Doodle[]
}