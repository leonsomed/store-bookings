interface LabelPairProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

export function LabelPair({ label, value }: LabelPairProps) {
  return (
    <div className="flex justify-between">
      <div className="font-bold">{label}</div>
      <div>{value}</div>
    </div>
  );
}
