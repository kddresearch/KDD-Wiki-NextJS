import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "./breadcrumb";

export default function Footer() {
    return (
        <>
            <Breadcrumb/>
            <footer className="bg-gray h-auto md:h-32">
                <div className="container flex flex-row md:flex-row h-full">
                    <Link className="grow md:w-auto" href={ "https://www.k-state.edu" }>
                        <Image src="/ksu-purple.svg" alt="unit" width="250" height="58" className="pr-4 h-8 h-full mx-auto md:mx-0"/>
                    </Link>
                    <div className="flex flex-col py-8 h-full text-black px-4 grow">
                        <ul className="flex flex-col md:flex-row grow my-auto">
                            <li className="pr-8 m-auto">
                                <Link href={"/contact"}>Contact Us</Link>
                            </li>
                            <div className="realitive pr-8 border-l-[1px] border-purple border-solid h-8 w-1 m-auto hidden md:block"></div>
                            <li className="pr-8 m-auto">
                                <Link href={"https://www.k-state.edu"}>KSU Homepage</Link>
                            </li>
                            <div className="realitive pr-8 border-l-[1px] border-purple border-solid h-8 w-1 m-auto hidden md:block"></div>
                            <li className="pr-8 m-auto">
                                <Link href={"https://www.engg.k-state.edu"}>KSU Engineering</Link>
                            </li>
                            <div className="realitive pr-8 border-l-[1px] border-purple border-solid h-8 w-1 m-auto hidden md:block"></div>
                            <li className="pr-8 m-auto">
                                <Link href={"https://www.cs.k-state.edu"}>KSU Comp Sci</Link>
                            </li>
                        </ul>
                        <div className="border-b-[1px] my-2 md:hidden border-purple"></div>
                        <ul className="flex flex-col md:flex-row grow my-auto">
                            <li className="pr-8 m-auto">
                                <Link href={"/copyright"}>© Kansas State Univerity</Link>
                            </li>
                            <div id="bar" className="realitive pr-8 border-l-[1px] border-purple border-solid h-8 w-1 m-auto hidden md:block"></div>
                            <li className="pr-8 m-auto">
                                <Link href={"../edit"}>Updated: 3/25/2024</Link>
                            </li>
                            <li className="grow">

                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
} 