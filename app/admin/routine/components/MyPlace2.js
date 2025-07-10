const MyPlace2 = () => {
  return (
    <>
      <h1 className="font-bold text-2xl">마이 플레이스 영수증 리뷰 작성</h1>

      <p className="mt-10 text-lg">
        {`1. 마이 플레이스에 "방문자 리뷰" 를 클릭해준다.`}
      </p>
      <p className="mt-10 text-lg">
        {`2. 작성 가이드라인을 작성해준다. 여기는 구체적으로 작성할 필요 없이,
        간단한 키워드로 작성`}
      </p>
      <p className="mt-10 text-lg">
        {`3. 영수증 이미지를 업로드해주고, 포토리뷰 이미지를 0~2장 업로드해준다.`}
      </p>
      <p className="mt-1 text-sm">
        {`*"파트원 사진 모음" 폴더에 들어가 사진을 0~2장 이내로 선택해 "사용한
        파트원 사진 모음" 으로 이동시키고 업로드해준다.`}
      </p>
    </>
  );
};

export default MyPlace2;
