class Word < ActiveRecord::Base
  CHARS = [
   [['z'], ['t'], ['j'], ['f']],
   [['c'], ['h'], ['i', 'y'], []],
   [[], ['d', 'm'], ['k', 's', 'v', 'l', 'r'], ['b', 'n']],
   [['e', 'w', 'x'], ['a'], ['o', 'g', 'q'], ['u']]
  ]

  def self.latest
    self.all(:limit => 12)
  end
end
