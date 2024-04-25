import classNames from 'classnames';

/**
 * Automatically adds a striped background to the backdrop, with a container for the children.
 */
function StripeBackDrop({ 
  isRow, 
  children,
  ...props
}: { 
  isRow?: boolean; 
  children?: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>) {
  const bgClasses = 'min-h-full grow text-black items-center justify-center bg-white bg-stripe';
  const rowClasses = classNames('flex flex-row', props.className);
  const columnClasses = classNames('flex flex-col', props.className);

  const containterClasses = classNames({
    [rowClasses]: isRow,
    [columnClasses]: !isRow,
    'container': true,
  });

  return ( 
    <div {...props} className={bgClasses}>
      <div className={containterClasses}>
        {children}
      </div>
    </div>
  );
}

export default StripeBackDrop;