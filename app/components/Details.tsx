export default function Details({ feedback }: { feedback: Feedback }) {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-2xl text-black! font-bold'>Details</h3>
      <p className='text-lg text-gray-500'>{feedback.overallScore}</p>
    </div>
  );
}
