import classNames from "classnames";
import Link from "next/link";
import { ReactNode } from "react";
import { BoxArrowUpRight } from "react-bootstrap-icons";

function Card({
  title = undefined,
  subTitle = undefined,
  smallTitle = undefined,
  actions = undefined,
  link = undefined,
  isFlex = true,
  ...props
}: {
  title?: string;
  subTitle?: string;
  smallTitle?: string;
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
    'shadow-md',
    'gap-5',
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
      <div className="flex flex-row items-center text-purple text-3xl lg:text-4xl xl:text-6xl font-bold mb-4">
        {link ? (
          <Link href={link} className="grow flex items-center">
            <h1 className="border-b-8 py-2 border-lightgray">{title}</h1>
            <div className="grow" />
            <BoxArrowUpRight className="text-2xl lg:text-4xl inline-block justify-center my-auto" />
          </Link>
        ) : (
          <>
            <h1 className="border-b-8 py-2 border-lightgray mr-4">{title}</h1>
            <div className="grow" />
            {actions}
          </>
        )}
      </div>
    );
  };

  const renderSubTitle = () => {
    return (
      <h2 className="text-xl lg:text-2xl font-semibold text-purple my-1">{subTitle}</h2>
    );
  }

  const renderSmallTitle = () => {
    return (
      <h3 className="text-lg lg:text-lg font-semibold text-darkgray my-1">{smallTitle}</h3>
    );
  }

  return (
    <div {...props} className={classes}>
      {title && renderTitleBar()}
      {subTitle && renderSubTitle()}
      {smallTitle && renderSmallTitle()}
      {props.children}
    </div>
  );
}

export default Card;
