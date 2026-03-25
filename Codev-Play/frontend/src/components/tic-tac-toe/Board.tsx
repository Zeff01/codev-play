type BoardProps = {
  children: React.ReactNode;
};

export function Board({ children }: BoardProps) {
  return <div className="grid grid-cols-3 gap-2 w-64">{children}</div>;
}
