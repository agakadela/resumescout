export default function ATS({
  score,
  suggestions,
}: {
  score: number;
  suggestions: {
    type: 'good' | 'improve';
    tip: string;
  }[];
}) {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-2xl text-black! font-bold'>ATS</h3>
      <p className='text-lg text-gray-500'>{score}</p>
      <ul className='list-disc list-inside'>
        {suggestions.map((suggestion) => (
          <li key={suggestion.tip}>{suggestion.tip}</li>
        ))}
      </ul>
    </div>
  );
}
