import type { TransformResult } from "@/lib/normalize/types";

const KOREAN_PARTICLE_PATTERN =
  /((?<!다)[가-힣]|[A-Za-z0-9])[ \t]+(은|는|이|가|을|를|에|에서|와|과|도|만|로|으로|의|에게|께서|처럼|보다|부터|까지|마다|조차|밖에)(?=[ \t]|[,.!?)]|$)/g;

export function languageAwareSpacing(text: string): TransformResult {
  let nextText = text;
  let collapsedLines = 0;

  const replaceAndCount = (pattern: RegExp, replacer: string) => {
    const matches = nextText.match(pattern);
    collapsedLines += matches?.length ?? 0;
    nextText = nextText.replace(pattern, replacer);
  };

  replaceAndCount(/[ \t]+([,.;:!?])/g, "$1");
  replaceAndCount(/([([{])\s+/g, "$1");
  replaceAndCount(/\s+([)\]}])/g, "$1");
  replaceAndCount(KOREAN_PARTICLE_PATTERN, "$1$2");
  replaceAndCount(
    /(은|는|이|가|을|를|에|에서|와|과|도|만|로|으로|의|에게|께서|처럼|보다|부터|까지|마다|조차|밖에)(이|그|저)\s/g,
    "$1 $2 ",
  );
  replaceAndCount(/(해서|하셔서|여서|라서|로서|으로서|는데|지만)(이|그|저)\s/g, "$1 $2 ");

  return {
    text: nextText,
    stats: {
      collapsedLines,
    },
  };
}
