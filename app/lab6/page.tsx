"use client"
import dynamic from 'next/dynamic';

const DocumentPDF = dynamic(() => import('@/components/scanify/DocumentPDF'), { ssr: false });
//import { DocumentPDF } from "@/components/scanify/DocumentPDF";
// import components
export default function Home() {
	return (
		<main className="">
			<DocumentPDF />
		</main>
	);
}
