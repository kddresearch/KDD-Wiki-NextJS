import classNames from "classnames";
import Link from "next/link";
import { ReactNode } from "react";
import { BoxArrowUpRight } from "react-bootstrap-icons";

function Card({
  title = undefined,
  actions = undefined,
  link = undefined,
  isFlex = true,
  ...props
}: {
  title?: string;
  actions?: ReactNode;
  link?: string;
  isFlex?: boolean;
} & React.HTMLProps<HTMLDivElement>) {

  const baseClasses = classNames(
    'container',
    'p-5',
    'bg-white',
    'text-lg',
    'my-8',
    props.className
  );

  const classes = classNames(baseClasses, {
    'flex flex-col': isFlex,
  });

  const renderTitleBar = () => {
    return (
      <div className="flex flex-row text-purple text-6xl font-bold">
        {link ? (
          <Link href={link} className="grow flex flex-row items-center">
            <h1 className="border-b-8 py-2 border-gray">{title}</h1>
            <div className="grow"/>
            <BoxArrowUpRight className="text-4xl inline-block justify-center my-auto" />
          </Link>
        ) : (
          <h1 className="border-b-8 py-2 border-gray">{title}</h1>
        )}
        {actions}
      </div>
    )
  }

  return (
    <div {...props} className={classes}>
      {title && renderTitleBar()}
      {props.children}
    </div>
  );
}

export default Card;
