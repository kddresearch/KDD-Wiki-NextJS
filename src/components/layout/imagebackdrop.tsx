import classNames from 'classnames';
import Image from 'next/image';

function ImageBackDrop({ 
  isRow,
  image,
  children,
  ...props
}: { 
  isRow?: boolean; 
  image: string,
  children?: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>) {
  const baseClasses = `h-128 relative min-h-full grow text-black items-center justify-center`;
  const rowClasses = classNames(baseClasses, 'flex md:flex-row', props.className);
  const columnClasses = classNames(baseClasses, 'flex flex-col', props.className);

  const classes = classNames({
    [rowClasses]: isRow,
    [columnClasses]: !isRow,
    // if a class starting with h- is passed, it will be added to the classes
  });

  return (
    <div {...props} className={classes}>
      <Image
        alt='backdrop'
        src={image}
        fill
        sizes="100vw"
        className='relative object-cover pointer-events-none -z-[1]' 
      />
      {children}
    </div>
  );
}

export default ImageBackDrop;