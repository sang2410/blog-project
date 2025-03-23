import axios from 'axios';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import navigateBackBlackIcon from '@/assets/svg/navigate-back-black.svg';
import navigateBackWhiteIcon from '@/assets/svg/navigate-back-white.svg';
import ModalComponent from '@/components/modal';
import CategoryPill from '@/components/category-pill';
import { categories } from '@/utils/category-colors';

type FormData = {
  title: string;
  authorName: string;
  imageLink: string;
  categories: string[];
  description: string;
  isFeaturedPost: boolean;
};

function AddBlog() {
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const [modal, setModal] = useState(false); // Sửa "setmodal" thành "setModal" để nhất quán
  const [formData, setFormData] = useState<FormData>({
    title: '',
    authorName: '',
    imageLink: '',
    categories: [],
    description: '',
    isFeaturedPost: false,
  });

  // Kiểm tra độ dài mảng categories và xem category đã được chọn chưa
  const isValidCategory = (category: string): boolean => {
    return formData.categories.length >= 3 && !formData.categories.includes(category);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryClick = (category: string) => {
    if (isValidCategory(category)) return;

    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((cat) => cat !== category),
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    }
  };

  const handleSelector = () => { // Sửa "handleselector" thành "handleSelector" để nhất quán
    setFormData({
      ...formData,
      imageLink: selectedImage,
    });
    setModal(false);
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, isFeaturedPost: !formData.isFeaturedPost });
  };

  const validateFormData = () => {
    if (
      !formData.title ||
      !formData.authorName ||
      !formData.imageLink ||
      !formData.description ||
      formData.categories.length === 0
    ) {
      toast.error('Tất cả các trường phải được điền đầy đủ.');
      return false;
    }
    const imageLinkRegex = /\.(jpg|jpeg|png|webp)$/i;
    if (!imageLinkRegex.test(formData.imageLink)) {
      toast.error('URL hình ảnh phải kết thúc bằng .jpg, .jpeg, .webp hoặc .png');
      return false;
    }
    if (formData.categories.length > 3) {
      toast.error('Chọn tối đa ba danh mục.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFormData()) {
      try {
        const response = await axios.post(`${window.API_URL}/api/posts/`, formData); // Sửa lỗi ghép chuỗi URL

        if (response.status === 200) {
          toast.success('Bài viết blog đã được tạo thành công!');
          navigate('/');
        } else {
          toast.error('Lỗi: ' + response.data.message);
        }
      } catch (err: any) {
        toast.error('Lỗi: ' + err.message);
      }
    }
  };

  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setIsDarkMode(storedTheme === 'dark');
  }, []);

  function Asterisk() {
    return <span className="dark:text-dark-tertiary">*</span>;
  }

  return (
    <div className="flex-grow cursor-default bg-slate-50 px-6 py-8 dark:bg-dark">
      <div className="mb-4 flex justify-center">
        <div className="flex w-[32rem] items-center justify-start space-x-4 md:w-5/6 lg:w-4/6 ">
          <div className="w-fit cursor-pointer">
            <img
              src={isDarkMode ? navigateBackWhiteIcon : navigateBackBlackIcon}
              onClick={() => navigate(-1)}
              className="active:scale-click h-5 w-10"
            />
          </div>
          <h2 className="cursor-text text-lg font-semibold text-light-primary dark:text-dark-primary md:text-xl lg:text-2xl">
            Tạo Blog
          </h2>
        </div>
      </div>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="md:w-5/6 lg:w-2/3">
          <div className="mb-2 flex items-center">
            <label className="flex items-center">
              <span className="px-2 text-base font-medium text-light-secondary dark:text-dark-secondary">
                Đây có phải là bài blog nổi bật không?
              </span>
              <input
                type="checkbox"
                name="isFeaturedPost"
                className="ml-2 h-5 w-5 cursor-pointer rounded-full accent-purple-400"
                checked={formData.isFeaturedPost}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>

          <div className="mb-2">
            <div className="px-2 py-1 font-medium text-light-secondary dark:text-dark-secondary">
              Tiêu đề blog <Asterisk />
            </div>
            <input
              type="text"
              name="title"
              placeholder="Danh sách địa điểm du lịch trong năm nay"
              autoComplete="off"
              className="w-full rounded-lg bg-slate-200 p-3 placeholder:text-sm placeholder:text-light-tertiary dark:bg-dark-card dark:text-slate-50 dark:placeholder:text-dark-tertiary"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-1">
            <div className="px-2 py-1 font-medium text-light-secondary dark:text-dark-secondary">
              Nội dung blog <Asterisk />
            </div>
            <textarea
              name="description"
              placeholder="Bắt đầu viết tại đây…"
              rows={5}
              className="w-full rounded-lg bg-slate-200 p-3 placeholder:text-sm placeholder:text-light-tertiary dark:bg-dark-card dark:text-slate-50 dark:placeholder:text-dark-tertiary"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <div className="px-2 py-1 font-medium text-light-secondary dark:text-dark-secondary">
              Tên tác giả <Asterisk />
            </div>
            <input
              type="text"
              name="authorName"
              placeholder="Shree Sharma"
              className="w-full rounded-lg bg-slate-200 p-3 placeholder:text-sm placeholder:text-light-tertiary dark:bg-dark-card dark:text-slate-50 dark:placeholder:text-dark-tertiary"
              value={formData.authorName}
              onChange={handleInputChange}
            />
          </div>

          <div className="px-2 py-1 font-medium text-light-secondary dark:text-dark-secondary">
            Hình ảnh bìa blog
            <span className="text-xs tracking-wide text-dark-tertiary">
               (jpg/png/webp) 
            </span>
            <Asterisk />
          </div>
          <div className="mb-4 flex justify-between gap-2 md:gap-4">
            <input
              type="url"
              id="imagelink"
              name="imageLink"
              placeholder="https://…"
              autoComplete="off"
              className="w-3/4 rounded-lg bg-slate-200 p-3 placeholder:text-sm placeholder:text-light-tertiary dark:bg-dark-card dark:text-slate-50 dark:placeholder:text-dark-tertiary lg:w-10/12"
              value={formData.imageLink}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="lg:text-md active:scale-click w-1/4 rounded-lg bg-light-primary text-xs text-slate-50 hover:bg-light-primary/80 dark:bg-dark-primary dark:text-dark-card dark:hover:bg-dark-secondary/80 md:text-sm lg:w-2/12 lg:px-4 lg:py-3"
              onClick={() => {
                setModal(true);
              }}
            >
              Chọn hình ảnh
            </button>
          </div>
          <div className="mb-4 flex flex-col">
            <label className="px-2 pb-1 font-medium text-light-secondary dark:text-dark-secondary md:mr-4 md:w-fit">
              Danh mục
              <span className="text-xs tracking-wide text-dark-tertiary">
                 (tối đa 3 danh mục) 
              </span>
              <Asterisk />
            </label>
            <div className="flex flex-wrap gap-3 rounded-lg p-2 dark:bg-dark-card dark:p-3">
              {categories.map((category, index) => (
                <span key={`${category}-${index}`} onClick={() => handleCategoryClick(category)}>
                  <CategoryPill
                    category={category}
                    selected={formData.categories.includes(category)}
                    disabled={isValidCategory(category)}
                  />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="active:scale-click flex w-full items-center justify-center rounded-lg bg-light-primary px-12 py-3 text-base font-semibold text-light hover:bg-light-primary/80 dark:bg-dark-primary dark:text-dark-card dark:hover:bg-dark-secondary/80 md:mx-1 md:w-fit"
          >
            Đăng blog
          </button>
        </form>
        <ModalComponent
          selectedImage={selectedImage}
          handleImageSelect={handleImageSelect}
          handleSelector={handleSelector} // Sửa để khớp với tên hàm
          setModal={setModal} // Sửa để khớp với tên hàm
          modal={modal}
        />
      </div>
    </div>
  );
}

export default AddBlog;