

function BackDrop({ isRow, ...props }: { isRow?: boolean } & React.HTMLProps<HTMLDivElement>) {

  var className

  if (isRow) {
    className = 'flex md:flex-row' + props.className;
  } else {
    className = 'flex flex-col' + props.className;
  }


  className = 'bg-white min-h-full grow text-black bg-stripe items-center justify-center ' + className;


  return (
    <div {...props} className={className}/>
  ); 
}

export default BackDrop;