type SearchProps = {
  className?: string;
};

const Search = ({ className }: SearchProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.0005 18.002C11.8465 18.002 13.5435 17.367 14.8975 16.314L19.2935 20.71L20.7075 19.296L16.3115 14.9C17.3655 13.545 18.0005 11.848 18.0005 10.002C18.0005 5.59095 14.4115 2.00195 10.0005 2.00195C5.58949 2.00195 2.00049 5.59095 2.00049 10.002C2.00049 14.413 5.58949 18.002 10.0005 18.002ZM10 4.00394C13.309 4.00394 16 6.69494 16 10.0039C16 13.3129 13.309 16.0039 10 16.0039C6.691 16.0039 4 13.3129 4 10.0039C4 6.69494 6.691 4.00394 10 4.00394Z"
        fill="#374458"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.4123 8.58511C11.7913 8.96511 12.0003 9.46711 12.0003 9.99911H14.0003C14.0003 8.93411 13.5843 7.93011 12.8263 7.17111C11.3123 5.65911 8.68732 5.65911 7.17432 7.17111L8.58632 8.58711C9.34632 7.82911 10.6563 7.83111 11.4123 8.58511Z"
        fill="#374458"
      />
    </svg>
  );
};

export default Search;
