import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IBalance } from "../../providers/types";
import { Block } from "./Block";

@Entity()
export class Balance implements IBalance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index()
  address!: string;

  @ManyToOne(() => Block, { persistence: false })
  @JoinColumn({
    name: "blockNumber",
    referencedColumnName: "blockNumber",
  })
  block!: Block;

  @Column("float")
  value!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
