"use client"
import dynamic from 'next/dynamic';

const DocumentIMGAndPDF = dynamic(() => import('@/components/scanify/DocumentIMGAndPDF'), { ssr: false });
//import { DocumentIMGAndPDF } from "@/components/scanify/DocumentIMGAndPDF";
// import components
export default function Home() {
	return (
		<main className="">
			<DocumentIMGAndPDF />
		</main>
	);
}
