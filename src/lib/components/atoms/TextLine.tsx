import { Line } from "@/lib/type/rules";
import Link from "next/link";

interface Props {
    line: Line
}

const TextLine = ({line}: Props) => 
    <>
        {line.map((segment, index) => (
            typeof segment === 'string' ? segment : <Link className="underline" key={`${segment.text}-${index}`} href={segment.url}>{segment.text}</Link>
        ))}
    </>

export default TextLine