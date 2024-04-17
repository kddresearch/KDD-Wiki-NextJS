function BackDrop({
  isRow,
  image,
  ...props
}: { isRow?: boolean, image?: string } & React.HTMLProps<HTMLDivElement>) {
  var className;

  if (isRow) {
    className = "flex md:flex-row " + props.className;
  } else {
    className = "flex flex-col " + props.className;
  }

  if (image) {
    className = "bg-cover bg-[url('" + image + "')] " + className;
  } else {
    className = "bg-white bg-stripe " + className;
  }

  className =
    "min-h-full grow text-black items-center justify-center " +
    className;

  return <div {...props} className={className} />;
}

export default BackDrop;
