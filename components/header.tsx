import Image from "next/image";
export default function Header() {
  return (
    <div className="flex flex-row justify-between items-center p-4 bg-gray-800 text-white">
      <div>
        <Image src="/images/baatcheet.png" alt="Logo" width={70} height={50} />
      </div>

      <div className="flex space-x-2 text-xl">
        <a href="http://">Sign In</a>
        {"/"}
        <a href="http://">Sign Up</a>
      </div>
    </div>
  );
}
