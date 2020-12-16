### CommentArea需要的数据



> **id自动发送，故省略**

#### get_comment_area

- 讨论区名称name
- 论文路径path
- 讨论区关注人数star_number
- 当前用户是否关注讨论区tar
- 短评列表（只包含id）short_comment_list
- 长评列表（只包含id）long_comment_list

#### get_short_comment

- 发布者poster
- 发布时间post_time
- 内容content
- 点赞人数rose_number
- 点踩人数egg_number
- 当前用户是否点赞rose
- 当前用户是否点踩egg

#### get_long_comment     inCommentArea=true

- **由于LongComment只包含短评id了，此处也可以直接发送完整的LongComment类**
- 发布者poster
- 发布时间post_time
- 标题title
- 内容content（只需要前50字，也可以发全部）
- 关注人数star_number
- 当前用户是否关注star

#### get_long_comment     inCommentArea=false

- 发布者poster
- 发布时间post_time
- 标题title
- 内容content
- 关注人数star_number
- 当前用户是否关注star
- ==当前用户是否拥有owner==
- 短评列表（只包含id）short_comment_list

#### get_create_comment_area_request

- 论文标题title
- 论文路径path

#### get_star_long_comment（是叫这个么）

- 收藏长评列表（只包含id）long_comment_list

#### get_star_comment_area_list

- **由于comment_area只包含短评长评id了，此处也可以直接发送完整的CommentArea类**
- 收藏讨论区列表（只包含id）comment_area_list