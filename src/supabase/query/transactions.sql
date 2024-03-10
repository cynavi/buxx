create table transactions (
  id uuid default gen_random_uuid(),
  "userId" uuid references auth.users not null,
  name varchar(50) not null,
  date timestamp not null,
  amount numeric(20, 3) not null,
  "isExpense" boolean not null,
  details text,
  primary key(id)
);

alter table transactions enable row level security;

create policy "Authenticated users can insert" on transactions for insert to authenticated with check (true);

create policy "Users can view their own transaction" on transactions
  for select using (auth.uid() = "userId");

create policy "Users can delete their own transaction" on transactions
  for delete using (auth.uid() = "userId");

create policy "Users can update their own transaction" on transactions
  for update using (auth.uid() = "userId");