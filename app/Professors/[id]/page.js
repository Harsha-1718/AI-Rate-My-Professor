import { retrieveDataFromPinecone } from '../../api/queryPinecone/route';
import ProfessorDetailClient from '../../professorClientDetails';

export default async function ProfessorDetail({ params }) {
  const { id } = params; // The professor's ID from the dynamic route
  let professorData;

  try {
    const decodedId = decodeURIComponent(id); // Decode the ID to ensure it matches the format in Pinecone
    console.log('Fetching data for Professor ID:', decodedId);
    professorData = await retrieveDataFromPinecone(decodedId);
    console.log('Professor Data:', professorData);
  } catch (error) {
    console.error('Error fetching professor data:', error);
    return <div>Error loading professor data.</div>;
  }

  if (!professorData) {
    console.error(`No data found for Professor ID: ${id}`);
    return <div>No data found for this professor.</div>;
  }

  return (
    <ProfessorDetailClient professorData={professorData} />
  );
}
