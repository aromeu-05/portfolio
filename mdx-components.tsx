import type { MDXComponents } from "mdx/types";
import {
  BeforeAfter,
  Chapter,
  Frise,
  Learn,
  Phones,
  Question,
  Stats,
  StatusList,
  Timeline,
  Todo,
} from "@/components/case/CaseBlocks";
import Figure from "@/components/case/Figure";

// Composants disponibles sans import dans les fichiers MDX.
const components: MDXComponents = {
  Chapter,
  Question,
  Learn,
  Stats,
  StatusList,
  Timeline,
  BeforeAfter,
  Frise,
  Phones,
  Todo,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
