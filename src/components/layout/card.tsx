import classNames from "classnames";
import Link from "next/link";
import { ReactNode } from "react";
import { BoxArrowUpRight } from "react-bootstrap-icons";

function Card({
  title = undefined,
  subTitle = undefined,
  actions = undefined,
  link = undefined,
  isFlex = true,
  ...props
}: {
  title?: string;
  subTitle?: string;
  actions?: ReactNode;
  link?: string;
  isFlex?: boolean;
} & React.HTMLProps<HTMLDivElement>) {

  const hasBackgroundColor = /bg-/.test(props.className || '');

  const baseClasses = classNames(
    'p-5',
    hasBackgroundColor ? '' : 'bg-white',
    'text-lg',
    'my-8',
    props.className
  );

  // Check if actions and link are provided without title
  if (title === undefined && (actions !== undefined || link !== undefined)) 
    throw new Error("Actions and Link can only be provided if title is provided");

  const classes = classNames(baseClasses, {
    'flex flex-col': isFlex,
  });

  const renderTitleBar = () => {
    return (
      <div className="flex flex-row text-purple text-4xl lg:text-6xl font-bold">
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

  const renderSubTitle = () => {
    return (
      <h2 className="text-xl lg:text-3xl font-bold text-purple border-b-4 border-gray">{subTitle}</h2>
    );
  }

  return (
    <div {...props} className={classes}>
      {title && renderTitleBar()}
      {subTitle && renderSubTitle()}
      {props.children}
    </div>
  );
}

export default Card;
