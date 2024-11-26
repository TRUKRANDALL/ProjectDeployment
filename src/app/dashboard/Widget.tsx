"use client";

import { LucideIcon } from "lucide-react";
import Link from 'next/link';

interface WidgetProps {
  id: string;
  name: string;
  Icon: LucideIcon;
  description: string;
  onClick?: () => void;
}

const Widget: React.FC<WidgetProps> = ({ id, name, Icon, description, onClick }) => {
  const content = (
    <>
      <Icon className="text-orange-500 w-12 h-12 lg:w-16 lg:h-16 group-hover:text-white" />
      <div className="text-center mt-5"> 
        <h1 className="text-lg font-bold mb-0 pb-0 group-hover:text-orange-950">{name}</h1>
        <h6 className="text-xs text-gray-500 group-hover:text-gray-200">{description}</h6>
      </div>
    </>
  );

  const className = "w-[180px] h-[180px] lg:w-[250px] lg:h-[250px] bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:drop-shadow-[0_10px_15px_rgba(249,115,22,0.4)] hover:scale-110 hover:border hover:border-orange-600 hover:bg-orange-500 group";

  if (onClick) {
    return (
      <div className={className} onClick={onClick}>
        {content}
      </div>
    );
  }

  return (
    <Link 
      href={`/widget?id=${id}&name=${name}`}
      className={className}
    >
      {content}
    </Link>
  )
}

export default Widget;