import ResultsSection from '../ResultsSection';

export default function ResultsSectionExample() {
  return (
    <div className="p-8">
      <ResultsSection 
        onDownload={() => console.log('Download clicked')}
        onStartOver={() => console.log('Start over clicked')}
      />
    </div>
  );
}
