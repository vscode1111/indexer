import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
  Index,
} from "typeorm";
import { ITransaction } from "../../providers/types";
import { Block } from "./Block";

@Entity()
export class Transaction implements ITransaction {
  @PrimaryColumn()
  hash!: string;

  @ManyToOne(() => Block, { persistence: false })
  @JoinColumn({
    name: "blockNumber",
    referencedColumnName: "blockNumber",
  })
  block!: Block;

  @Column()
  @Index()
  transactionIndex!: number;

  @Column({ type: "varchar", nullable: true })
  @Index()
  from!: string | null;

  @Column({ type: "varchar", nullable: true })
  @Index()
  to!: string | null;

  @Column("float")
  value!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
