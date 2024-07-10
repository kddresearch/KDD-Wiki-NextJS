import Card from "@/components/layout/card";
import Link from "next/link";

interface NavigationCardProps {
  children: { id: number; title: string }[];
}

const NavigationCard: React.FC<NavigationCardProps> = ({ children }) => {
  return (
    <Card subTitle="Navigation" className="bg-gray">
      <ul>
        {children.map((child) => (
          <li key={child.id}>
            <Link href={`/rpage/${child.id}`}>
              {child.title}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default NavigationCard;
