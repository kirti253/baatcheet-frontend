export default function Header() {
  return (
    <div className="flex flex-row justify-between items-center p-4bg-gray-900 text-white">
      <div>
        <h1 className="text-2xl font-bold">Baatcheet</h1>
      </div>

      <div className="flex space-x-2 text-xl">
        <a href="http://">Sign In</a>
        {"/"}
        <a href="http://">Sign Up</a>
      </div>
    </div>
  );
}
