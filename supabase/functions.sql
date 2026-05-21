-- Increment the used_count of a coupon by 1.
-- Called after a successful order placement that used a coupon.
create or replace function increment_coupon_usage(p_code text)
returns void as $$
  update coupons set used_count = used_count + 1 where code = p_code;
$$ language sql;
