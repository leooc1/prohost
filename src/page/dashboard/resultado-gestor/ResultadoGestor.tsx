export default function ResultadoGestor() {
  return (
    <div>
      <main className="md:px-8 px-2 grid grid-cols-1 md:grid-cols-3 gap-2 min-h-110">
        <div className="grid grid-rows-5 gap-2">
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
          <div className="bg-secondary">a</div>
        </div>
        <div className="grid grid-rows-5 md:col-span-2 gap-2">
          <div className="bg-secondary row-span-5">a</div>
        </div>
      </main>
    </div>
  );
}
