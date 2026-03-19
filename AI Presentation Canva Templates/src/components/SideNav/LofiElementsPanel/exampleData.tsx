import React from 'react';

// IMAGE IMPORTS
import AiImageGeneratorAddImage from './assets/ai-image-generator-add-image.svg?react';
import AiImageGeneratorBlankImage from './assets/ai-image-generator-blank-image.svg?react';
import Table1Image from './assets/table1-image.svg?react';
import Table2Image from './assets/table2-image.svg?react';
import Table3Image from './assets/table3-image.svg?react';
import Table4Image from './assets/table4-image.svg?react';
import Table5Image from './assets/table5-image.svg?react';
import TrendingCollectionsImage from './assets/trending-collections-image.svg?react';
import Audio1 from './assets/audio-1.svg?react';
import Audio2 from './assets/audio-2.svg?react';

// EMAIL STUFF IMPORTS
import HeadspaceHeaderLogo from './assets/email-stuff/header/headspace-header.svg';
import HeaderLogoText1 from './assets/email-stuff/header/header-logo-text-1.svg';
import HeaderLogoText2 from './assets/email-stuff/header/header-logo-text-2.svg';
import HeaderLogoOnly from './assets/email-stuff/header/header-logo-only.svg';

import HeadspaceButton from './assets/email-stuff/button/headspace-button.svg';
import Button1 from './assets/email-stuff/button/button-1.svg';
import Button2 from './assets/email-stuff/button/button-2.svg';
import Button3 from './assets/email-stuff/button/button-3.svg';
import Button4 from './assets/email-stuff/button/button-4.svg';

import HeadspaceLayout from './assets/email-stuff/layout/headspace-layout.svg';
import Layout1 from './assets/email-stuff/layout/layout-1.svg';
import Layout2 from './assets/email-stuff/layout/layout-2.svg';
import Layout3 from './assets/email-stuff/layout/layout-3.svg';
import Layout4 from './assets/email-stuff/layout/layout-4.svg';
import Layout5 from './assets/email-stuff/layout/layout-5.svg';
import Layout6 from './assets/email-stuff/layout/layout-6.svg';
import Layout7 from './assets/email-stuff/layout/layout-7.svg';
import Layout8 from './assets/email-stuff/layout/layout-8.svg';
import Layout9 from './assets/email-stuff/layout/layout-9.svg';
import Layout10 from './assets/email-stuff/layout/layout-10.svg';
import Layout11 from './assets/email-stuff/layout/layout-11.svg';

import HeadspaceLink from './assets/email-stuff/link/headspace-links.svg';
import Link1 from './assets/email-stuff/link/link-1.svg';
import Link2 from './assets/email-stuff/link/link-2.svg';
import Link3 from './assets/email-stuff/link/link-3.svg';

// Browse Categories
import BannerCategory from './assets/categories/Banners.svg?react';
import HeadersCategory from './assets/categories/Headers.svg?react';
import ButtonsCategory from './assets/categories/Buttons.svg?react';
import FootersCategory from './assets/categories/Footers.svg?react';
import IconBlocksCategory from './assets/categories/IconBlocks.svg?react';
import ColumnsCategory from './assets/categories/Columns.svg?react';

import HighlightBlocksCategory from './assets/categories/HighlightBlock.svg?react';
import SheetsCategory from './assets/categories/Sheets.svg?react';
import TablesCategory from './assets/categories/Tables.svg?react';
import ChartsCategory from './assets/categories/Charts.svg?react';
import GraphicsCategory from './assets/categories/Graphics.svg?react';
import PhotosCategory from './assets/categories/Photos.svg?react';
import VideosCategory from './assets/categories/Videos.svg?react';
import StickersCategory from './assets/categories/Stickers.svg?react';

// Type definitions
export interface ItemBase {
  id: string;
  title: string;
}

export interface ImageItem extends ItemBase {
  image?: string | React.ReactElement;
}

export interface AudioItem extends ItemBase {
  artist: string;
  duration: string;
  genre?: string;
  mood?: string;
  image: string | React.ReactElement;
}

export interface ShapeItem extends ItemBase {
  type: 'square' | 'circle' | 'line' | 'triangle' | 'diamond' | 'hexagon' | 'star' | 'heart';
}

export interface TrendingItem extends ItemBase {
  image: string | React.ReactElement;
  subtitle?: string;
}

export interface ChartItem extends ItemBase {
  image: string;
}

export interface TableItem extends ItemBase {
  image: string | React.ReactElement;
}

export interface AiPrompt {
  id: string;
  text: string;
  image: string | React.ReactElement;
}

// Filter/category cards data
export const filterCards: ItemBase[] = [
  { id: 'filter1', title: '' },
  { id: 'filter2', title: '' },
  { id: 'filter3', title: '' },
  { id: 'filter4', title: '' },
];

// Recently used items data
export const recentlyUsedItems: ItemBase[] = [
  { id: 'recent1', title: '' },
  { id: 'recent2', title: '' },
  { id: 'recent3', title: '' },
  { id: 'recent4', title: '' },
  { id: 'recent5', title: '' },
  { id: 'recent6', title: '' },
  { id: 'recent7', title: '' },
  { id: 'recent8', title: '' },
  { id: 'recent9', title: '' },
  { id: 'recent10', title: '' },
  { id: 'recent11', title: '' },
  { id: 'recent12', title: '' },
];

// Shapes data
export const shapesItems: ShapeItem[] = [
  { id: 'shape1', type: 'square', title: 'Square' },
  { id: 'shape2', type: 'circle', title: 'Circle' },
  { id: 'shape3', type: 'line', title: 'Line' },
  { id: 'shape4', type: 'triangle', title: 'Triangle' },
  { id: 'shape5', type: 'diamond', title: 'Diamond' },
  { id: 'shape6', type: 'hexagon', title: 'Hexagon' },
  { id: 'shape7', type: 'triangle', title: 'Triangle' },
  { id: 'shape8', type: 'square', title: 'Square' },
  { id: 'shape9', type: 'circle', title: 'Circle' },
  { id: 'shape10', type: 'line', title: 'Line' },
];

// Graphics items data
export const graphicsItems: ItemBase[] = [
  { id: 'graphic1', title: '' },
  { id: 'graphic2', title: '' },
  { id: 'graphic3', title: '' },
  { id: 'graphic4', title: '' },
  { id: 'graphic5', title: '' },
  { id: 'graphic6', title: '' },
  { id: 'graphic7', title: '' },
  { id: 'graphic8', title: '' },
  { id: 'graphic9', title: '' },
  { id: 'graphic10', title: '' },
];

// AI image prompts data
export const aiPrompts: AiPrompt[] = [
  {
    id: 'prompt1',
    text: 'Generate your own',
    image: <AiImageGeneratorAddImage />,
  },
  {
    id: 'prompt2',
    text: '"Watercolour koi fish swimming in a pond"',
    image: <AiImageGeneratorBlankImage />,
  },
  {
    id: 'prompt3',
    text: '"A panda riding a wave on a surfboard"',
    image: <AiImageGeneratorBlankImage />,
  },
];

// Photos items data
export const photosItems: ItemBase[] = [
  { id: 'photo1', title: '' },
  { id: 'photo2', title: '' },
  { id: 'photo3', title: '' },
  { id: 'photo4', title: '' },
  { id: 'photo5', title: '' },
  { id: 'photo6', title: '' },
  { id: 'photo7', title: '' },
  { id: 'photo8', title: '' },
  { id: 'photo9', title: '' },
  { id: 'photo10', title: '' },
];

// Videos items data
export const videosItems: ItemBase[] = [
  { id: 'video1', title: '' },
  { id: 'video2', title: '' },
  { id: 'video3', title: '' },
  { id: 'video4', title: '' },
  { id: 'video5', title: '' },
  { id: 'video6', title: '' },
  { id: 'video7', title: '' },
  { id: 'video8', title: '' },
  { id: 'video9', title: '' },
];

// Frames items data
export const framesItems: ItemBase[] = [
  { id: 'frame1', title: '' },
  { id: 'frame2', title: '' },
  { id: 'frame3', title: '' },
  { id: 'frame4', title: '' },
  { id: 'frame5', title: '' },
  { id: 'frame6', title: '' },
  { id: 'frame7', title: '' },
  { id: 'frame8', title: '' },
  { id: 'frame9', title: '' },
  { id: 'frame10', title: '' },
];

// Charts items data
export const chartsItems: ChartItem[] = [
  { id: 'chart1', title: '', image: '' },
  { id: 'chart2', title: '', image: '' },
  { id: 'chart3', title: '', image: '' },
  { id: 'chart4', title: '', image: '' },
  { id: 'chart5', title: '', image: '' },
  { id: 'chart6', title: '', image: '' },
  { id: 'chart7', title: '', image: '' },
  { id: 'chart8', title: '', image: '' },
  { id: 'chart9', title: '', image: '' },
  { id: 'chart10', title: '', image: '' },
];

// Audio items data
export const audioItems: AudioItem[] = [
  {
    id: 'audio1',
    title: 'Advertising',
    artist: 'Artist',
    duration: '0:00',
    genre: 'Genre • Genre',
    image: <Audio1 className="lofi-audio-thumbnail" />,
  },
  {
    id: 'audio2',
    title: 'Happy Whistling Ukelele',
    artist: 'Anonymous',
    duration: '2:03',
    mood: 'Bright • Happy',
    image: <Audio2 className="lofi-audio-thumbnail" />,
  },
];

// Tables items data
export const tablesItems: TableItem[] = [
  { id: 'table1', title: '', image: <Table1Image /> },
  { id: 'table2', title: '', image: <Table2Image /> },
  { id: 'table3', title: '', image: <Table3Image /> },
  { id: 'table4', title: '', image: <Table4Image /> },
  { id: 'table5', title: '', image: <Table5Image /> },
  { id: 'table6', title: '', image: <Table1Image /> },
  { id: 'table7', title: '', image: <Table2Image /> },
  { id: 'table8', title: '', image: <Table3Image /> },
  { id: 'table9', title: '', image: <Table4Image /> },
  { id: 'table10', title: '', image: <Table5Image /> },
];

// Grids items data
export const gridsItems: ImageItem[] = [
  { id: 'grid1', title: '' },
  { id: 'grid2', title: '' },
  { id: 'grid3', title: '' },
  { id: 'grid4', title: '' },
  { id: 'grid5', title: '' },
  { id: 'grid6', title: '' },
  { id: 'grid7', title: '' },
  { id: 'grid8', title: '' },
  { id: 'grid9', title: '' },
  { id: 'grid10', title: '' },
];

// Trending collections data
export const trendingCollections: TrendingItem[] = [
  {
    id: 'trending1',
    title: 'Textured Half Tone Elements',
    subtitle: '24 graphics',
    image: <TrendingCollectionsImage />,
  },
  {
    id: 'trending2',
    title: 'Cute Colorful Fun Frames',
    subtitle: '24 graphics',
    image: <TrendingCollectionsImage />,
  },
  {
    id: 'trending3',
    title: 'Textured Half Tone Elements',
    subtitle: '24 graphics',
    image: <TrendingCollectionsImage />,
  },
  {
    id: 'trending4',
    title: 'Cute Colorful Fun Frames',
    subtitle: '24 graphics',
    image: <TrendingCollectionsImage />,
  },
  {
    id: 'trending5',
    title: 'Textured Half Tone Elements',
    subtitle: '24 graphics',
    image: <TrendingCollectionsImage />,
  },
  {
    id: 'trending6',
    title: 'Cute Colorful Fun Frames',
    subtitle: '24 graphics',
    image: <TrendingCollectionsImage />,
  },
  {
    id: 'trending7',
    title: 'Textured Half Tone Elements',
    subtitle: '24 graphics',
    image: <TrendingCollectionsImage />,
  },
  {
    id: 'trending8',
    title: 'Cute Colorful Fun Frames',
    subtitle: '24 graphics',
    image: <TrendingCollectionsImage />,
  },
];

// EMAIL ITEMS DATA
export const headerItems: TrendingItem[] = [
  {
    id: 'header0',
    title: 'Header with Logo and Text',
    image: HeadspaceHeaderLogo,
  },
  {
    id: 'header1',
    title: 'Header with Logo and Text',
    image: HeaderLogoText1,
  },
  {
    id: 'header2',
    title: 'Header with Logo and Text Alt',
    image: HeaderLogoText2,
  },
  {
    id: 'header3',
    title: 'Header with Logo Only',
    image: HeaderLogoOnly,
  },
];

export const buttonItems: TrendingItem[] = [
  {
    id: 'button0',
    title: 'Headspace Button',
    image: HeadspaceButton,
  },
  {
    id: 'button1',
    title: 'Button Style 1',
    image: Button1,
  },
  {
    id: 'button2',
    title: 'Button Style 2',
    image: Button2,
  },
  {
    id: 'button3',
    title: 'Button Style 3',
    image: Button3,
  },
  {
    id: 'button4',
    title: 'Button Style 4',
    image: Button4,
  },
];

export const columnItems: TrendingItem[] = [
  {
    id: 'column0',
    title: 'Headspace Column',
    image: HeadspaceLayout,
  },
  {
    id: 'layout1',
    title: 'Single Column',
    image: Layout1,
  },
  {
    id: 'layout2',
    title: 'Two Columns',
    image: Layout2,
  },
  {
    id: 'layout3',
    title: 'Three Columns',
    image: Layout3,
  },
  {
    id: 'layout4',
    title: 'Four Columns',
    image: Layout4,
  },
  {
    id: 'layout5',
    title: 'Layout 5',
    image: Layout5,
  },
  {
    id: 'layout6',
    title: 'Layout 6',
    image: Layout6,
  },
  {
    id: 'layout7',
    title: 'Layout 7',
    image: Layout7,
  },
  {
    id: 'layout8',
    title: 'Layout 8',
    image: Layout8,
  },
  {
    id: 'layout9',
    title: 'Layout 9',
    image: Layout9,
  },
  {
    id: 'layout10',
    title: 'Layout 10',
    image: Layout10,
  },
  {
    id: 'layout11',
    title: 'Layout 11',
    image: Layout11,
  },
];

export const linkItems: TrendingItem[] = [
  {
    id: 'link0',
    title: 'Headspace Link',
    image: HeadspaceLink,
  },
  {
    id: 'link1',
    title: 'Simple Link',
    image: Link1,
  },
  {
    id: 'link2',
    title: 'Button Link',
    image: Link2,
  },
  {
    id: 'link3',
    title: 'Styled Link',
    image: Link3,
  },
];

// Browse categories data
export const browseCategories: ImageItem[] = [
  { id: 'category-headers', title: 'Headers', image: <HeadersCategory /> },
  { id: 'category-footers', title: 'Footers', image: <FootersCategory /> },
  { id: 'category-buttons', title: 'Buttons', image: <ButtonsCategory /> },
  { id: 'category-icon-blocks', title: 'Icon Blocks', image: <IconBlocksCategory /> },
  { id: 'category-columns', title: 'Columns', image: <ColumnsCategory /> },
  {
    id: 'category-highlight-blocks',
    title: 'Highlight Blocks',
    image: <HighlightBlocksCategory />,
  },
  { id: 'category-graphics', title: 'Graphics', image: <GraphicsCategory /> },
  { id: 'category-photos', title: 'Photos', image: <PhotosCategory /> },
  { id: 'category-videos', title: 'Videos', image: <VideosCategory /> },
  { id: 'category-stickers', title: 'Stickers', image: <StickersCategory /> },
  { id: 'category-charts', title: 'Charts', image: <ChartsCategory /> },
  { id: 'category-sheets', title: 'Sheets', image: <SheetsCategory /> },

  { id: 'category-tables', title: 'Tables', image: <TablesCategory /> },
];
