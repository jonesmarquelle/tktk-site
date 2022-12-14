//{comment_count: number, like_count: number, repost_count: number, thumbnail: string, creator(Name): string, uploader(Username): string}

import Link from "next/link"

interface TiktokVideo {
    username: string,
    name: string,
    likesCount: number,
    commentsCount: number,
    sharesCount: number,
    thumbnail: string,
}

interface VideoInfoProps {
    className?: string,
    video?: TiktokVideo,
}

const VideoInfo: React.FC<VideoInfoProps> = (props) => {
    const values = [props.video?.likesCount ?? '-', props.video?.commentsCount ?? '-', props.video?.sharesCount ?? '-']
    const likesSVG =
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#808080">
            <path d="M7.5 2.25C10.5 2.25 12 4.25 12 4.25C12 4.25 13.5 2.25 16.5 2.25C20 2.25 22.5 4.99999 22.5 8.5C22.5 12.5 19.2311 16.0657 16.25 18.75C14.4095 20.4072 13 21.5 12 21.5C11 21.5 9.55051 20.3989 7.75 18.75C4.81949 16.0662 1.5 12.5 1.5 8.5C1.5 4.99999 4 2.25 7.5 2.25Z" />
        </svg>
    const commentsSVG = 
        <svg className="w-10 h-10" viewBox="0 0 20 20" fill="#808080">
            <path fill-rule="evenodd" d="M16.0393 14.7137C17.75 13 18.75 11.215 18.75 9.13662C18.75 4.91897 14.8887 1.49997 10.125 1.49997C5.36129 1.49997 1.5 4.91897 1.5 9.13675C1.5 13.3545 5.48622 16.25 10.25 16.25V17.6487C10.25 18.0919 10.7095 18.3771 11.0992 18.1659C12.3166 17.5062 14.5725 16.183 16.0393 14.7137ZM5.93527 8.10679C6.61608 8.10679 7.16797 8.65471 7.16797 9.32962C7.16797 10.0059 6.61608 10.5538 5.93527 10.5538C5.2556 10.5538 4.70368 10.0059 4.70368 9.32962C4.70368 8.65471 5.2556 8.10679 5.93527 8.10679ZM11.3572 9.32962C11.3572 8.65471 10.8055 8.10679 10.125 8.10679C9.44459 8.10679 8.89289 8.65471 8.89289 9.32962C8.89292 10.0059 9.44462 10.5538 10.125 10.5538C10.8055 10.5538 11.3572 10.0059 11.3572 9.32962ZM14.3146 8.10679C14.9953 8.10679 15.5464 8.65471 15.5464 9.32962C15.5464 10.0059 14.9953 10.5538 14.3146 10.5538C13.6339 10.5538 13.082 10.0059 13.0821 9.32962C13.0821 8.65471 13.6339 8.10679 14.3146 8.10679Z"></path>        
        </svg>
    const sharesSVG = 
        <svg className="w-10 h-10" viewBox="0 0 20 20" fill="#808080">
            <path d="M10.9376 3.17495C10.9376 2.58272 11.6469 2.27873 12.0758 2.68715L18.6021 8.90241C19.1764 9.44937 19.1564 10.3717 18.5588 10.8931L12.0541 16.5689C11.6184 16.9491 10.9376 16.6397 10.9376 16.0614V13.4894C10.9376 13.4894 3.95344 12.2312 1.7131 16.3434C1.50423 16.7268 0.690072 16.8609 0.855563 14.948C1.54761 11.4273 2.96196 5.93084 10.9376 5.93084V3.17495Z" />
        </svg>

    return (
        <div className={`${props.className} flex flex-col items-center`}>
            {props.video?.name ? (
                <span className="text-xl text-center sm:text-2xl font-bold">{props.video.name}</span>
            ) : (
                <div className="rounded-full bg-neutral-500 w-1/2"/>
            )}
            {props.video?.username ? (
                <Link className="text-lg hover:underline" href={`https://www.tiktok.com/@${props.video.username}`}>
                    {`@${props.video.username}`}
                </Link>
            ) : (
                <div className="rounded-full bg-neutral-500 w-1/3"/>
            )}
            <div className="flex flex-row gap-3">
                {[likesSVG, commentsSVG, sharesSVG].map((svgElement, idx) => 
                    <div key={idx} className="flex flex-col items-center">
                        {svgElement}
                        <span className="text-md">
                            {values[idx]}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoInfo;