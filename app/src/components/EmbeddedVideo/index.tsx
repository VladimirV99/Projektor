import React from 'react';

type EmbeddedVideoProps = {
    src: string;
    width?: number;
    height?: number;
};

const EmbeddedVideo = ({
    src,
    width,
    height,
}: EmbeddedVideoProps): JSX.Element => {
    return (
        <iframe
            width={width || 560}
            height={height || 315}
            src={src}
            title="YouTube video player"
            frameBorder="0"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
        ></iframe>
    );
};

export default EmbeddedVideo;
