import { ReactNode } from "react";

function Card({
  title = undefined,
  actions = undefined,
  isFlex = true,
  ...props
}: { title?: string } & { actions?: ReactNode } & {
  isFlex?: boolean;
} & React.HTMLProps<HTMLDivElement>) {
  let className;

  if (isFlex) {
    className =
      "flex flex-col container p-5 bg-white text-lg my-8 " + props.className;
  } else {
    className = "container p-5 bg-white text-lg my-8 " + props.className;
  }

  // const className = 'flex flex-col container p-5 bg-white text-lg my-8 ' + props.className;

  return (
    <div {...props} className={className}>
      {title ? (
        <div className="flex flex-row text-purple text-6xl font-bold">
          <h1 className="border-b-8 py-2 border-gray">{title}</h1>
          <div className="grow"> </div>
          {actions}
        </div>
      ) : (
        <></>
      )}
      {props.children}
    </div>
  );
}

export default Card;
