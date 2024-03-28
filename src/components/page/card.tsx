import { ReactNode } from "react";


function Card({ title = undefined, actions = undefined, ...props }: { title?: string } & {actions?: ReactNode} & React.HTMLProps<HTMLDivElement>) {
  
  const className = 'flex flex-col container p-5 bg-white text-lg my-8 ' + props.className;

    return (
    <div {...props} className={className} > 
      {title? 
      <div className="flex flex-row text-purple text-6xl font-bold">
        <h1 className="border-b-8 py-2 border-gray">{title}</h1>
        {actions}
      </div>
      : 
      <></>}
      {props.children}
    </div>
  );
};

export default Card;