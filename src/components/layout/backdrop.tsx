import classNames from 'classnames';

function StripeBackDrop({ 
  isRow, 
  ...props
}: { 
  isRow?: boolean; 
} & React.HTMLProps<HTMLDivElement>) {
  const baseClasses = 'min-h-full grow text-black items-center justify-center bg-white bg-stripe';
  const rowClasses = classNames(baseClasses, 'flex md:flex-row', props.className);
  const columnClasses = classNames(baseClasses, 'flex flex-col', props.className);

  const classes = classNames({
    [rowClasses]: isRow,
    [columnClasses]: !isRow,
  });

  return <div {...props} className={classes} />;
}

export default StripeBackDrop;