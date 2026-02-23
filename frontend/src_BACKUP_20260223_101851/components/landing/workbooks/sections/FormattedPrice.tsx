interface FormattedPriceProps {
  value: string;
  className?: string;
  currencyClassName?: string;
}

export default function FormattedPrice({
  value,
  className = "",
  currencyClassName = "text-sm opacity-70",
}: FormattedPriceProps) {
  const parts = value.split(" ");

  if (parts.length === 1) {
    return <span className={className}>{value}</span>;
  }

  const price = parts[0];
  const currency = parts[1];

  return (
    <span className={className}>
      {price}
      <span className={currencyClassName}> {currency}</span>
    </span>
  );
}
