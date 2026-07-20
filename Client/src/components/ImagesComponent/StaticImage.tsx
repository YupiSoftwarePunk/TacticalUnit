import React, { useState, useEffect } from "react";
import { ImageService, ImageType } from "@/shared/api/services/imageService";

interface StaticImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    type: ImageType;
    entityId: number | string | undefined;
}

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

export const StaticImage: React.FC<StaticImageProps> = ({
    type,
    entityId,
    className,
    alt,
    ...props
}) => {
    const [extIndex, setExtIndex] = useState<number>(0);
    const [isFallback, setIsFallback] = useState<boolean>(true);
    const [fallbackExtIndex, setFallbackExtIndex] = useState<number>(0);

    useEffect(() => {
        setExtIndex(0);
        setIsFallback(false);
        setFallbackExtIndex(0);
    }, [type, entityId]);

    const handleError = () => {
        if (!isFallback) {
            if (extIndex < ALLOWED_EXTENSIONS.length - 1) {
                setExtIndex((prev) => prev + 1);
            } 
            else {
                setIsFallback(true);
            }
        } 
        else {
            if (fallbackExtIndex < ALLOWED_EXTENSIONS.length - 1) {
                setFallbackExtIndex((prev) => prev + 1);
            }
        }
    };

    const src = isFallback || !entityId
        ? `${ImageService.getDefaultImageUrl(type)}${ALLOWED_EXTENSIONS[fallbackExtIndex]}`
        : `${ImageService.getEntityImageUrl(type, entityId)}${ALLOWED_EXTENSIONS[extIndex]}`;

    return (
        <img
            src={src}
            onError={handleError}
            className={className}
            alt={alt || `${type} image`}
            {...props}
        />
    );
};