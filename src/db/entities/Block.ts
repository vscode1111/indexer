import { Entity, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { Balance } from "./Balance";
import { Transaction } from "./Transaction";

@Entity()
export class Block {
  @PrimaryColumn()
  blockNumber!: number;

  @OneToMany(() => Transaction, (photo) => photo.block)
  transactions!: Transaction[];

  @OneToMany(() => Balance, (photo) => photo.block)
  balances!: Balance[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
