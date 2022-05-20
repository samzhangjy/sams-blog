import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import {
  getSectionBySlug,
  getAllSections,
} from "../../lib/api";
import config from "../../config";
import Navbar from "../../components/Navbar";
import { useScrollTrigger } from "../../hooks";
import Footer from "../../components/Footer";
import "highlight.js/styles/github-dark.css";
import CustomSection from "../../components/CustomSection";
import Header from "../../components/Header";
import { GetStaticProps, NextPage } from "next";

export interface SectionDataItem {
  title: string;
  description: string;
  cover: string;
  link: string;
}

export interface Section {
  data: SectionDataItem[] | string;
  name: string;
  description: string;
  slug?: string;
  newPage?: boolean;
}

export interface ViewSectionProps {
  section: Section;
}

interface ViewSectionSlug {
  slug: string;
}

interface ViewSectionParam {
  params: ViewSectionSlug;
}

const ViewSection: NextPage<ViewSectionProps> = ({ section }) => {
  const router = useRouter();
  const trigger = useScrollTrigger(150);
  if (!router.isFallback && !section?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <div className="container">
      <Head>
        <title>
          {section.name} - {config.site.title}
        </title>
        <meta name="description" content={section.description} />
      </Head>
      <Navbar show={trigger} />
      <Header />
      <CustomSection {...section} />
      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = ({ params }) => {
  let slug = "";
  if (params && typeof params.slug === "object") slug = params.slug[0];
  else if (params && typeof params.slug === "string") slug = params.slug;
  const section = getSectionBySlug(slug);

  return {
    props: { section },
  };
}

export async function getStaticPaths() {
  const sections = getAllSections();
  const slugs: ViewSectionParam[] = [];

  sections.map((value) => {
    if (value.newPage && value.slug) {
      slugs.push({
        params: {
          slug: value.slug,
        },
      });
    }
    return null;
  });

  return {
    paths: slugs,
    fallback: false,
  };
}

export default ViewSection;