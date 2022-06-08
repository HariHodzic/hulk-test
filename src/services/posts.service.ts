import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/dto/posts/create-post.dto';
import { UpdatePostDto } from 'src/dto/posts/update-post.dto';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {

  constructor(
      @InjectRepository(Post)
      private postRepository: Repository<Post>,
  ){}

  async getPostById(id: string): Promise<Post> {
    const result = await this.postRepository.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return result;
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post>{
    const { title, description}  = createPostDto;
    const post = this.postRepository.create(createPostDto);
    await this.postRepository.save(post);
    return post;
  }

  async deletePost(id: string): Promise<void> {
    const result = await this.postRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post>{
    const result = await this.postRepository.findOne({ where: { id: id } });

    if (!result) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    result.title = updatePostDto.title;
    result.description = updatePostDto.description;
    result.edited = updatePostDto.edited;
    await this.postRepository.save(result);
    return result;
  }
}
