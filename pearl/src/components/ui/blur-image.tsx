
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export function BlurImage({
  src,
  alt,
  className,
  wrapperClassName,
  ...props
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
      };
    }
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-all duration-500 ease-in-out",
          isLoaded ? "blur-0 scale-100" : "blur-lg scale-105",
          className
        )}
        {...props}
      />
    </div>
  );
}
