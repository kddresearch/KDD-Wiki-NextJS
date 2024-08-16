import * as React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { Primitive } from '@radix-ui/react-primitive';
import Nextimage from 'next/image';

import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Icon
 * -----------------------------------------------------------------------------------------------*/

const ICON_NAME = 'Icon';

type ScopedProps<P> = P & { __scopeIcon?: Scope };
const [createIconContext, createIconScope] = createContextScope(ICON_NAME);

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

type IconContextValue = {
  imageLoadingStatus: ImageLoadingStatus;
  onImageLoadingStatusChange(status: ImageLoadingStatus): void;
};

const [IconProvider, useIconContext] = createIconContext<IconContextValue>(ICON_NAME);

type IconElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface IconProps extends PrimitiveSpanProps {}

const Icon = React.forwardRef<IconElement, IconProps>(
  (props: ScopedProps<IconProps>, forwardedRef) => {
    const { __scopeIcon: __scopeIcon, ...iconProps } = props;
    const [imageLoadingStatus, setImageLoadingStatus] = React.useState<ImageLoadingStatus>('idle');
    return (
      <IconProvider
        scope={__scopeIcon}
        imageLoadingStatus={imageLoadingStatus}
        onImageLoadingStatusChange={setImageLoadingStatus}
      >
        <Primitive.span {...iconProps} ref={forwardedRef} />
      </IconProvider>
    );
  }
);

Icon.displayName = ICON_NAME;

/* -------------------------------------------------------------------------------------------------
 * IconImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = 'IconImage';

type IconImageElement = React.ElementRef<typeof Nextimage>;
type PrimitiveImageProps = React.ComponentPropsWithoutRef<typeof Nextimage>;
interface IconImageProps extends Omit<PrimitiveImageProps, 'loading' > {}

const IconImage = React.forwardRef<IconImageElement, IconImageProps>(
  (props: ScopedProps<IconImageProps>, forwardedRef) => {
    const { __scopeIcon: __scopeIcon, src, className, ...imageProps } = props;
    const context = useIconContext(IMAGE_NAME, __scopeIcon);
    const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

    console.log('IconImage', src);

    const handleLoadingStatusChange = useCallbackRef((status: ImageLoadingStatus) => {
      context.onImageLoadingStatusChange(status);
    });

    const onLoadCallback = useCallbackRef((event) => {
      imageProps.onLoad?.(event);
      setLoadingStatus('loaded');
    });

    const onImageError = useCallbackRef((event) => {
      imageProps.onError?.(event);
      setLoadingStatus('error');
    });

    useLayoutEffect(() => {
      console.log('useLayoutEffect', loadingStatus, src);
      if (loadingStatus !== 'idle') {
        handleLoadingStatusChange(loadingStatus);
      }
    }, [loadingStatus, handleLoadingStatusChange, src]);

    return (
      <Nextimage {...imageProps} ref={forwardedRef} loading='eager' src={src} onLoad={onLoadCallback} onError={onImageError} className={className + ` ${loadingStatus === 'loaded' ? '' : 'hidden'}`} />
    );
  }
);

IconImage.displayName = IMAGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * IconFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'IconFallback';

type IconFallbackElement = React.ElementRef<typeof Primitive.span>;
interface IconFallbackProps extends PrimitiveSpanProps {
  delayMs?: number;
}

const IconFallback = React.forwardRef<IconFallbackElement, IconFallbackProps>(
  (props: ScopedProps<IconFallbackProps>, forwardedRef) => {
    const { __scopeIcon: __scopeIcon, delayMs, ...fallbackProps } = props;
    const context = useIconContext(FALLBACK_NAME, __scopeIcon);
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timerId = window.setTimeout(() => setCanRender(true), delayMs);
        return () => window.clearTimeout(timerId);
      }
    }, [delayMs]);

    return canRender && context.imageLoadingStatus !== 'loaded' ? (
      <Primitive.span {...fallbackProps} ref={forwardedRef} />
    ) : null;
  }
);

IconFallback.displayName = FALLBACK_NAME;

const Root = Icon;
const Image = IconImage;
const Fallback = IconFallback;

export {
  createIconScope as createIconScope,
  //
  Icon,
  IconImage,
  IconFallback,
  //
  Root,
  Image,
  Fallback,
};
export type { IconProps, IconImageProps, IconFallbackProps };
