// 定义章节接口，用于解析过程中的临时对象
interface ChapterData {
  title?: string;
  sequence?: number;
  start_char?: number;
  end_char?: number;
  chapter_content?: string;
}

/**
 * 智能文本章节解析器
 * 功能特性：
 * 1. 支持多级章节标题识别（章/节）
 * 2. 自动处理章节内容分割
 * 3. 智能处理超长章节拆分
 * 4. 精确计算字符偏移量
 */
const analysisTextChapter = (content: string): ChapterData[] => {
  // 预处理：移除BOM头并初始化
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  content = content.replace(/\r\n/g, '\n').replace(/\u3000/g, ' '); // 统一换行符

  // 第一阶段：解析原始章节结构
  const rawChapters: ChapterData[] = [];

  /**
   * 增强型正则表达式说明：
   * - 支持中文数字（零～万）和阿拉伯数字
   * - 同时识别"章"和"节"两种标题类型
   * - 兼容全角/半角符号（：、:、—、-等）
   * - 示例匹配："第1章 引言" 或 "第一节: 开端——故事开始"
   */
  const chapterRegex = /^\s*第[零一二三四五六七八九十百千万\d]+[章节][ \t：:—-]*(.*?)(?=[ \t]*$)/gm;

  let match;
  while ((match = chapterRegex.exec(content)) !== null) {
    // 增强空标题处理（关键修改点2）
    const rawTitle = match[1] ? match[1].trim() : '';
    const title = rawTitle || '未命名章节';
    const headerLength = match[0].length; // 包含完整标题头的长度
    const chapterStart = match.index + headerLength; // 正文起始位置

    // 设置前一章节的结束位置
    if (rawChapters.length > 0) {
      rawChapters[rawChapters.length - 1].end_char = match.index;
    }

    rawChapters.push({
      title,
      sequence: rawChapters.length + 1,
      start_char: chapterStart,
      end_char: content.length, // 初始设为全文末尾
    });
  }

  // 修正最后一章的实际结束位置
  if (rawChapters.length > 0) {
    rawChapters[rawChapters.length - 1].end_char = content.length;
  }
  console.log("rawChapters",rawChapters);

  // 第二阶段：处理章节拆分
  let processedChapters: ChapterData[] = [];
  const totalLength = content.length;

  if (rawChapters.length === 0) {
    // 无原始章节时的智能拆分策略
    processedChapters = splitEntireContent( content, 2500);
  } else {
    // 带原始章节的深度处理
    for (const chapter of rawChapters) {
      const chapterContent = content.slice(chapter.start_char!, chapter.end_char!);
      const chapterLength = chapterContent.length;

      // 大章节拆分条件：长度超过20K且占比超过总内容10%
      if (chapterLength > 20000 && chapterLength / totalLength > 0.1) {
        const subChapters = splitByParagraph(
          chapterContent,
          2500,
          chapter.start_char!,
          chapter.title || '未命名章节',
          processedChapters.length + 1
        );
        processedChapters.push(...subChapters);
      } else {
        // 直接继承原始章节
        processedChapters.push({
          ...chapter,
          sequence: processedChapters.length + 1,
        });
      }
    }
  }

  // 最终处理：统一序号 + 注入章节内容
  return processedChapters.map((chapter, index) => ({
    ...chapter,
    sequence: index + 1,
    chapter_content: extractSafeContent(content, chapter.start_char!, chapter.end_char!)
  }));
};

/**
 * 安全内容提取函数
 * @param content 原始文本
 * @param start 起始偏移量
 * @param end 结束偏移量
 */
const extractSafeContent = (content: string, start: number, end: number): string => {
  const safeStart = Math.max(0, start);
  const safeEnd = Math.min(content.length, end);
  return content.slice(safeStart, safeEnd);
};

// 无原始章节时的内容拆分逻辑
const splitEntireContent = (
  content: string,
  maxChars: number
): ChapterData[] => {
  const chapters: ChapterData[] = [];
  let currentStart = 0;
  let currentLength = 0;
  let globalOffset = 0;
  const paragraphs = content.split('\n');

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const isLastPara = i === paragraphs.length - 1;
    const paraTextLength = para.length;
    const paraTotalLength = paraTextLength + (isLastPara ? 0 : 1);

    // 处理超长段落
    if (paraTextLength > maxChars) {
      if (currentLength > 0) {
        chapters.push(createChapter( chapters.length + 1, currentStart, currentLength));
        currentStart += currentLength;
        currentLength = 0;
      }
      chapters.push(createChapter(chapters.length + 1, globalOffset, paraTextLength));
      globalOffset += paraTotalLength;
      currentStart = globalOffset;
      continue;
    }

    // 累积长度检查
    if (currentLength + paraTotalLength > maxChars) {
      chapters.push(createChapter( chapters.length + 1, currentStart, currentLength));
      currentStart = currentStart + currentLength;
      currentLength = paraTotalLength;
    } else {
      currentLength += paraTotalLength;
    }

    globalOffset += paraTotalLength;
  }

  // 处理最后章节
  if (currentLength > 0) {
    chapters.push(createChapter( chapters.length + 1, currentStart, currentLength));
  }

  // 修正结束位置
  if (chapters.length > 0) {
    const lastChapter = chapters[chapters.length - 1];
    lastChapter.end_char = Math.min(lastChapter.end_char!, content.length);
  }

  return chapters;
};

/**
 * 创建标准章节对象
 * @param sequence 章节序号
 * @param start 起始位置
 * @param length 章节长度
 */
const createChapter = (
  sequence: number,
  start: number,
  length: number
): ChapterData => ({
  title: '未命名章节',
  sequence,
  start_char: start,
  end_char: start + length,
  chapter_content: '' // 占位，最终会被统一注入
});

// 大章节拆分逻辑（保留原始标题）
const splitByParagraph = (
  content: string,
  maxChars: number,
  baseOffset: number,
  originalTitle: string,
  baseSequence: number
): ChapterData[] => {
  const paragraphs = content.split('\n').filter(p => p.length > 0);
  const chapters: ChapterData[] = [];
  let currentStart = 0;
  let currentLength = 0;

  paragraphs.forEach((para) => {
    const paraLength = para.length + 1; // 包含换行符

    if (currentLength > 0 && currentLength + paraLength > maxChars) {
      chapters.push(createSubChapter(currentStart, currentLength));
      currentStart += currentLength;
      currentLength = 0;
    }

    currentLength += paraLength;
  });

  if (currentLength > 0) {
    chapters.push(createSubChapter(currentStart, currentLength));
  }

  return chapters.map((chap, index) => ({
    ...chap,
    title: originalTitle + getChapterSuffix(chapters.length, index),
    sequence: baseSequence + index, // 继承基础序号
  }));

  function createSubChapter(start: number, length: number): ChapterData {
    return {
      title: '',
      sequence: 0, // 占位值，后续会覆盖
      start_char: baseOffset + start,
      end_char: baseOffset + start + length,
      chapter_content: '', // 占位
    };
  }

  function getChapterSuffix(total: number, index: number): string {
    if (total === 2) return index === 0 ? '（上）' : '（下）';
    if (total === 3) return ['（上）', '（中）', '（下）'][index];
    if (total >= 4) return `（第${index + 1}部分）`;
    return '';
  }
};

export { analysisTextChapter };
