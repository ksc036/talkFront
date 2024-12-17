// import { useDocsStore } from '@tmaxoffice/docs';
import { Icon, useTheme } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { VoteItemModel } from '@/models/VoteModel';

import * as S from './Styled';

interface VoteCategoryItemProps {
  itemsLength: number;
  item: VoteItemModel;
  id: number;
  handleDeleteItem: (idx: number) => void;
  handleItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VoteCategoryItem = observer(
  ({
    itemsLength,
    item,
    id,
    handleDeleteItem,
    handleItemChange,
  }: VoteCategoryItemProps) => {
    // const { voteStore } = useStore();
    // const docsStore = useDocsStore();
    // const driveStore = docsStore.getDriveStore();
    // const [imgSrc, setImgSrc] = useState<string>('');
    const { Color } = useTheme();

    // const onUploadImage = useCallback(
    //   (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (!e.target.files) {
    //       return;
    //     }
    //     voteStore.uploadImageList.push({
    //       orderNum: id,
    //       imageId: e.target.files[0],
    //     });
    //     voteStore.unloadImageList.filter((item) => item.orderNum !== id);

    //     setImgSrc(URL.createObjectURL(e.target.files[0]));
    //   },
    //   [],
    // );

    // const handleItemFileDelete = useCallback(() => {
    //   voteStore.unloadImageList.push({
    //     orderNum: id,
    //   });
    //   voteStore.uploadImageList = voteStore.uploadImageList.filter(
    //     (item) => item.orderNum !== id,
    //   );
    //   setImgSrc('');
    // }, []);

    // useEffect(() => {
    //   if (item.imageId) {
    //     (async () => {
    //       const res = await driveStore.requestThumbnailData(
    //         item.imageId as number,
    //       );
    //       setImgSrc(URL.createObjectURL(res));
    //     })();
    //   }
    // }, [item]);

    return (
      <S.VoteCategoryItem>
        <S.VoteTextField
          variant="outlined"
          placeholder={`${id + 1}번째 항목`}
          value={item.itemContent}
          onChange={handleItemChange}
          visibleClear={false}
          limit={20}
          width={itemsLength === 2 ? 404 : id === 0 ? 404 : 364}
          InputProps={{
            endAdornment: (
              <>
                {/* {imgSrc ? (
                  <S.SelectedImageWrapper>
                    <img width={20} height={20} src={imgSrc} />
                    <S.RemoveImageButton onClick={handleItemFileDelete}>
                      <Icon.CloseLine
                        width={16}
                        height={16}
                        color={Color.White[100]}
                      />
                    </S.RemoveImageButton>
                  </S.SelectedImageWrapper>
                ) : (
                  <S.ImagesButton htmlFor={String(id)}>
                    <Icon.ImageLine
                      width={20}
                      height={20}
                      color={Color.Gray[400]}
                    />
                    <input
                      id={String(id)}
                      type="file"
                      accept="image/*"
                      onChange={onUploadImage}
                    />
                  </S.ImagesButton>
                )} */}
              </>
            ),
          }}
        />

        {id > 0 && itemsLength > 2 && (
          <S.AddDeleteButton onClick={() => handleDeleteItem(id)}>
            <Icon.CloseLine width={20} height={20} color={Color.Gray[900]} />
          </S.AddDeleteButton>
        )}
      </S.VoteCategoryItem>
    );
  },
);

export default VoteCategoryItem;
