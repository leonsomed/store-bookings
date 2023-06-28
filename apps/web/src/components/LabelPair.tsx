interface LabelPairProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

export function LabelPair({ label, value }: LabelPairProps) {
  return (
    <div className="flex justify-between border-b-2 py-1 border-neutral-100 border-opacity-100 last:border-0">
      <div className="font-bold">{label}</div>
      <div className="font-light">{value}</div>
    </div>
  );
}
