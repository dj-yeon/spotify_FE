// app/search/page.tsx

import getSongsByTitle from '@/actions/getSongsByTitle';
import Header from '@/components/Header';
import SearchInput from '@/components/SearchInput';

import SearchContent from './components/SearchContent';

interface SearchProps {
  searchParams: {
    title: string;
  };
}

export const revalidate = 0;

const Search = async ({ searchParams }: SearchProps) => {
  // 2. 1.에서 받아온 param으로 검색
  //  const songs = await getSongsByTitle(searchParams.title);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Search</h1>
          {/* 1. SearchInput에 입력한 param으로, 다시 이 페이지로 불러옴 */}
          <SearchInput />
        </div>
      </Header>
      <SearchContent searchParams={searchParams} />
    </div>
  );
};

export default Search;
