export default function Loading() {
  return (
    <section className="bg-black/30 fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
      <div className="flex flex-row gap-4">
        <div className="size-6 rounded-full bg-primary animate-bounce"></div>
        <div className="size-6 rounded-full bg-primary animate-bounce [animation-delay:-.3s]"></div>
        <div className="size-6 rounded-full bg-primary animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </section>
  );
}
